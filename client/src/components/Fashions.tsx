import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createFashion, deleteFashion, getFashions, patchFashion } from '../api/fashions-api'
import Auth from '../auth/Auth'
import { Fashion } from '../types/Fashion'

interface FashionsProps {
  auth: Auth
  history: History
}

interface FashionsState {
  Fashions: Fashion[]
  newFashionName: string
  description: string
  price: number
  loadingFashions: boolean
}

export class Fashions extends React.PureComponent<FashionsProps, FashionsState> {
  state: FashionsState = {
    Fashions: [],
    newFashionName: '',
    description: '',
    price: 0,
    loadingFashions: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newFashionName: event.target.value })
  }

  onEditButtonClick = (FashionId: string) => {
    this.props.history.push(`/fashions/${FashionId}/edit`)
  }

  onFashionCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newFashion = await createFashion(this.props.auth.getIdToken(), {
        name: this.state.newFashionName,
        dueDate: dueDate
      })
      this.setState({
        Fashions: [...this.state.Fashions, newFashion],
        newFashionName: ''
      })
    } catch {
      alert('Fashion creation failed')
    }
  }

  onFashionDelete = async (FashionId: string) => {
    try {
      await deleteFashion(this.props.auth.getIdToken(), FashionId)
      this.setState({
        Fashions: this.state.Fashions.filter(Fashion => Fashion.fashionId !== FashionId)
      })
    } catch {
      alert('Fashion deletion failed')
    }
  }

  onFashionCheck = async (pos: number) => {
    try {
      const Fashion = this.state.Fashions[pos]
      await patchFashion(this.props.auth.getIdToken(), Fashion.fashionId, {
        name: Fashion.name,
        dueDate: Fashion.dueDate,
        done: !Fashion.done
      })
      this.setState({
        Fashions: update(this.state.Fashions, {
          [pos]: { done: { $set: !Fashion.done } }
        })
      })
    } catch {
      alert('Fashion deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const Fashions = await getFashions(this.props.auth.getIdToken())
      this.setState({
        Fashions,
        loadingFashions: false
      })
    } catch (e) {
      alert(`Failed to fetch Fashions: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">FASHIONs</Header>

        {this.renderCreateFashionInput()}

        {this.renderFashions()}
      </div>
    )
  }

  renderCreateFashionInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onFashionCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderFashions() {
    if (this.state.loadingFashions) {
      return this.renderLoading()
    }

    return this.renderFashionsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Fashions
        </Loader>
      </Grid.Row>
    )
  }

  renderFashionsList() {
    return (
      <Grid padded>
        {this.state.Fashions.map((Fashion, pos) => {
          return (
            <Grid.Row key={Fashion.fashionId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onFashionCheck(pos)}
                  checked={Fashion.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {Fashion.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {Fashion.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(Fashion.fashionId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onFashionDelete(Fashion.fashionId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {Fashion.attachmentUrl && (
                <Image src={Fashion.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
